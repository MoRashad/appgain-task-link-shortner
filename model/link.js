const linkSchema = {
  type: "object",
  properties: {
    slug: {
      type: "string",
    },
    ios: {
      type: "object",
      properties: {
        primary: {
          type: "string",
        },
        fallback: {
          type: "string",
        },
      },
      required: ["primary", "fallback"],
    },
    android: {
      type: "object",
      properties: {
        primary: {
          type: "string",
        },
        fallback: {
          type: "string",
        },
      },
      required: ["primary", "fallback"],
    },
    web: {
      type: "string",
    },
  },
  required: ["ios", "android", "web"],
  additionalProperties: false,
};

export default linkSchema;
