import Toast from 'react-native-root-toast';

const VALIDATE = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ALPHABET_ONLY: /^[a-zA-Z \s]*$/,
    NUMBER: /[0-9]$/,
    MOBILE: /^[0-9]{1,20}$/,
    STREET: /^[a-zA-Z0-9 '-.~!@#$%^&*()_+={}[];':"<>,.\s]*$/,
    PASSWORD: /[d\-_\s]+$/,
}

export const validators = {
    checkAlphabet: (name, min, max, value) => {
        var min = min || 2;
        var max = max || 45;
        if (value) {
            if (!VALIDATE.ALPHABET_ONLY.test(value)) { Toast.show(name + ' is Invalid.'); return false }
            else if (value.length < min || value.length > max) { Toast.show(`${name} must be between ${min} to ${max} Characters.`); return false }
            return true
        }
        else { Toast.show(name + " is Required"); return false }
    },

    checkEmail: (name, value) => {
        if (value) {
            if (!VALIDATE.EMAIL.test(value)) { Toast.show(`${name} is Invalid.`); return false }
        } else { Toast.show(`${name} is Required`); return false }
        return true
    },

    checkNumber: (name, min, max, value) => {
        var min = min || 7;
        var max = max || 15;
        if (value) {
            if (!VALIDATE.NUMBER.test(value)) { Toast.show(`${name} is Invalid.`); return false }
            else if (value.length < min || value.length > max) { Toast.show(`${name} entered must be between ${min} to ${max} Characters`); return false }
            return true
        }
        else { Toast.show(`${name} is Required`); return false }
    },

    checkPhoneNumber: (name, min, max, value) => {
        var min = min || 5;
        var max = max || 15;
        if (value) {
            if (!VALIDATE.MOBILE.test(value)) { Toast.show(`${name} is Invalid.`); return false }
            else if (value.length < min || value.length > max) { Toast.show(`${name} should be greater than ${min - 1} digits`); return false }
            return true
        }
        else { Toast.show(`${name} is Required`); return false }
    },

    checkNotNull: (name, min, max, value) => {
        var min = min || 5;
        var max = max || 40;
        if (value) {
            if (value.length < min || value.length > max) { Toast.show(`${name} must be between ${min} to ${max} Characters`); return false }
            return true
        }
        else { Toast.show(`${name} is Required`); return false }
    },

    checkRequire: (name, value) => {
        if (value) {
            return true
        }
        else { Toast.show(`Please enter ${name}`); return false }
    },

    checkPassword: (name, min, max, value) => {
        var min = min || 7;
        var max = max || 15;
        if (value) {
            if (VALIDATE.PASSWORD.test(value)) { Toast.show(`${name} is Invalid`); return false }
            else if (value.length < min || value.length > max) { Toast.show(`${name} entered must be between ${min} to ${max} Characters`); return false }
            return true
        }
        else { Toast.show(`${name} is Required`); return false }
    },

    checkMatch: (name, value, name2, value2) => {
        var min = min || 5;
        var max = max || 40;
        if (value == value2) {
            return true
        }
        else { Toast.show(`${name} and ${name2} should be same`); return false }
    },

    checkStreet: (name, min, max, value) => {
        var min = min || 7;
        var max = max || 15;
        if (value) {
            if (VALIDATE.STREET.test(value)) { Toast.show(`${name} is Invalid`); return false }
            else if (value.length < min || value.length > max) { Toast.show(`${name} entered must be between ${min} to ${max} Characters`); return false }
            return true
        }
        else { Toast.show(`${name} is Required`); return false }
    },
}