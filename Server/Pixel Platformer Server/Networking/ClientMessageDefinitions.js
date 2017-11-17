//These are the definitions that the client receives.

const Controllers = {
  Login: {
    ID: 1,
    Messages: {
      LoginSuccess: 1
    }
  },
  Register: {
    ID: 2,
    Messages: {
      RegisterSuccess: 1
    }
  },
  Chat: {
    ID: 3,
    Messages: {
    }
  },
  Game: {
    ID: 4,
    Messages: {
    }
  }
};

exports = Controllers;

let success = await doCheck();
if (!success) { return fail(); }
success = await doSecondCheck();
if (!success) { return fail(); }
//Run 3 and 4 in parallel and wait for both
let [thirdCheckSuccess, forthCheckSuccess] = await Promise.all([thirdCheck(), forthCheck()]);
if (!thirdCheckSuccess || !forthCheckSuccess) { return fail(); }
success = await doFifthCheck();
if (!success) { return fail(); }
return succeeded();