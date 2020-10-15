module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    var keyword = context.bindingData.keyword;

    if (req.query.keyword || (req.body && req.body.keyword)) {
        context.res = {
            // status defaults to 200 */
            body: `Jay Dave says ${keyword}`
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a keyword on the query string or in the request body"
        };
    }
    context.done();
};