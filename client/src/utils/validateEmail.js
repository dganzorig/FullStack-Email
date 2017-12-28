const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default email => {
    if(!re.test(email)) {
        return 'Please enter a valid email';
    }
    return;
}