# Uhura
As wikipedia points out "Uhura is a translator and communications officer who specializes in linguistics, cryptography, and philology." And that is exactly what she does here. Uhura helps you requesting some, sorr this is a secret, services and does basic error handling for you.

## User Guide
### Import getter for uguraRequest
    import {getUhura} from 'uhura';
    const uhuraRequest = getUhura();

or
   
    const getUhura = require('uhura').getUhura;
    const uhuraRequest = getUhura();

### Set default api path and headers
    uhuraRequest.setApiPath('http://(...).com');
    uhuraRequest.setHeaders({
      'Accept': 'application/json',
      ...
    });

### Call an api
    return uhuraRequest('post', 'Security/CreateSession')
      .send({
        Login: 'some_username@exampl.com',
        Password: 'password12345'
      })
      .end()
      .then(body => body.SessionId);