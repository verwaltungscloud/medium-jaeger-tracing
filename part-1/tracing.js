const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor, ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { JaegerPropagator } = require("@opentelemetry/propagator-jaeger");


/**
 * This file contains the tracing configuration for exporting the traces to jaeger
 */


//Exporter
module.exports = (serviceName) => {
    const exporter = new JaegerExporter({ endpoint: "http://jaeger:14268/api/traces" });
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register({ propagator: new JaegerPropagator() });
    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation()
        ],
        tracerProvider: provider,
    });
    return trace.getTracer(serviceName);
};