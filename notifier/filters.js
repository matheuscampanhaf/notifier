const filter =
    { "fields": { "subject": { "operation": "=", "value": "debug" }, "level": { "operation": ">", "value": 2 } } }

module.exports = filter;