import { toast } from 'react-toast';
import api from 'utils/api';

export const login = (data) => {
    return api.post('/sendotp-merchant', data);
}

export const register = (data) => {
    return api.post('/register', data);
}


export const getAuthUser = () => {
    return api.get('/auth');
}

export const updateAuthUser = (data) => {
    return api.post('/auth', data);
}

export const checkEmailExisted = (email) => {
    return new Promise((resolve, reject) => {
        return api.post('/email/check', {email}).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const loginViaFacebook = () => {
    return new Promise((resolve, reject) => {
        return api.get('/auth/facebook').then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const loginViaGoogle = () => {
    return new Promise((resolve, reject) => {
        return api.get('/auth/google').then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const sendOtpViaEmail = () => {
    return new Promise((resolve, reject) => {
        return api.post('/send-otp/email').then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const sendOtpViaMobile = () => {
    return new Promise((resolve, reject) => {
        return api.post('/send-otp/mobile').then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const verifyOtp = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/verify', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const forgotPassword = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/forgot-password', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            toast.error(err.response.data.message);
            reject(err);
        });
    })
}

export const resetPassword = (data) => {
    return new Promise((resolve, reject) => {
        return api.post('/reset-password', data).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getProfileProgress = () => {
    return new Promise((resolve, reject) => {
        return api.get('/progress').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

export const getSubscription = () => {
    return new Promise((resolve, reject) => {
        return api.get('/subscription').then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
}

