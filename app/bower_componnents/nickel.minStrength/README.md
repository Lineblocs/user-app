A directive for Angular to validate the strength of passwords
=============================================================

Ever needed to validate the strength of the password a user is trying to set?

Please Note that this Module requires [zxcvbn](https://github.com/dropbox/zxcvbn).

## Install

The easiest way is to install via bower:

    bower install nickel.minStrength

zxcvbn is set as dependency in bower.json, and will be installed automatically when you install via bower.

## How to use

Load zxcvbn and this Module inside your DOM, set this Module as dependency in your AngularJS-App, and you're ready to go:

    <form name="signupForm">
      <input name="password" type="password" min-strength="4" ng-model="user.password">
      <p ng-if="signupForm.password.$error.minStrength">The given Password is too weak!</p>
    </form>

The value for the min-strength-attribute is referring directly to the score-property coming from zxcvbn,
and can therefore be a value between 0 and 4. If you want to know more, then please take a look [here](https://github.com/dropbox/zxcvbn#usage)
