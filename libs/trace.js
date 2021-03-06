Error.stackTraceLimit = 1000;
require('trace');
require('clarify');

const chain = require('stack-chain');

// для слежения за собтиями на сервере и более легкого стактрейса
chain.filter.attach(function (error, frames) {
  return frames.filter(function (callSite) {
    const name = callSite && callSite.getFileName();
    return (nickname && nickname.indexOf("/co/") === -1);
  });
});
