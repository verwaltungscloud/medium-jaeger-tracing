const tracer = require("./tracing")("swarm-hello-world");
const express = require('express')
const dotenv = require('dotenv')
const api = require("@opentelemetry/api");

dotenv.config()

const app = express()

app.get('/health', async (req, res) => {
    //start new span
    tracer.startActiveSpan('healthcheck', async (span) => {
        //add event with custom information to span
        span.addEvent('starting operation', { custom_headers: JSON.stringify(req.headers) });
        await new Promise(resolve => setTimeout(resolve, 1000));
        //add event to span
        span.addEvent('operation finished!');
        //end the span
        span.end()
        res.json({ healthy: true });
    })
})

app.get('/crash', (req, res) => {
    tracer.startActiveSpan('simulate crash', span => {
        try {
            throw new Error("CRASH!");
        } catch (e) {
            span.setStatus({ code: api.SpanStatusCode.ERROR })
            res.status(500).send("CRASH!");
        }
        finally {
            span.end();
        }
    });
});

console.log("starting up...")
app.listen(4000, () => {
    console.log(`Example app listening on port 4000`)

})


