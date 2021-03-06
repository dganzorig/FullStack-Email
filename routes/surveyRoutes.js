// webhook preprocessing libraries:
const _ = require('lodash');
const Path = require('path-parser');
const{ URL } = require('url');

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {

    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false });
        res.send(surveys);
    }); 

    app.delete('/api/surveys/:surveyId', requireLogin, async (req, res) => {
        const deletedSurvey = await Survey.findByIdAndRemove(req.params.surveyId).select({recipients: false});
        res.send(deletedSurvey);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice'); // path-parser

        _.chain(req.body)
            .map(({ email, url }) => {
                const match = p.test(new URL(url).pathname); //extract variables from first line
                if(match) {
                    return { email, surveyId: match.surveyId, choice: match.choice }
                }
            })        
            .compact() //remove undefined (non-matches)
            .uniqBy('email', 'surveyId') // filter out duplicate email && surveyId
            .each(({ email, surveyId, choice}) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }
                }, {
                    $inc: { [choice]: 1 },
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                }).exec();
            })
            .value();

        res.send({}); // passive interaction - send empty object for prompt resolution
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients, sender } = req.body;

        const survey = new Survey({ 
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            sender,
            _user: req.user.id,
            dateSent: Date.now()
        });

        try {
            const mailer = new Mailer(survey, surveyTemplate(survey));
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch(err) {
            res.status(422).send(err);
        }
    });
};