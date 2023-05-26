After I came across Dropbox's really good password strength estimator [zxcvbn](https://github.com/dropbox/zxcvbn),
I just had to wrap it as a validator for AngularJS. It's incredibly useful and effective to be sure that your users aren't
setting weak passwords on their accounts.

If the given password isn't reaching the desired level of strength, we simply show a text-message as we do with any other not-passing
validation, which is much less distraction to the user than a progressbar showing the level of strength (for example).
You can also combine this validator with any other validator available in your AngularJS application
(you can see an example with ngMinlength in the Demo).
