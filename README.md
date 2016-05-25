# Final Code for Building Web Applications with hapi

This repository contains the final code for the [Building Web Applications with hapi course on Pluralsight.com](http://www.pluralsight.com/courses/hapi-building-web-applications) updated to the latest **hapi** version (13.4.1 for the moment).

## Installation

```
npm install
node server.js
```

## Notes (upgrading from v8 to v13)

1. To use **file** in handlers you need to install and register **[inert](https://github.com/hapijs/inert)** module.
2. For template rendering with ``server.view`` you need to install and register **[vision](https://github.com/hapijs/vision)** module  
3. Configuration of **[good](https://github.com/hapijs/good)** plugin has been changed since hapi 8.
4. If your app crashes with error **Error: Failed to encode cookie (sid) value: Password string too short (min 32 characters required)** be sure to set minimum 32 characters password in auth.strategy config:

    ```javascript
        server.auth.strategy('default', 'cookie', {
            password: 'minimum-32-characters-password1234567890', // min 32 characters required https://github.com/hapijs/hapi/issues/3040
            redirectTo: '/login',
            isSecure: false
        });
    ```
5. Mandrill is now a paid MailChimp add-on. You have to choose an alternative. 
Check out, for example: [Is Mandrill Done? 5 Alternatives for Your Transactional Email](http://www.codeinwp.com/blog/mandrill-alternatives/). 
I chose [SendGrid](https://sendgrid.com/). Register on site and create API KEY likewise for Mandrill in course video. SendGrid has official node.js [library](https://github.com/sendgrid/sendgrid-nodejs).  
