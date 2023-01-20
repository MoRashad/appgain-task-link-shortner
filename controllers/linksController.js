import linkSchema from "../model/link.js";
import db from "../firebase.js";
import useragent from "useragent";
import { generateShortLink } from "../middleware/generateShortLink.js";
import Ajv from "ajv";
const ajv = new Ajv();

export const getLinks = async (req, res) => {
  try {
    let links = [];
    const data = await db.collection("shortLinks").get();
    data.forEach((doc) => {
      let destinationUrl = "",
        fallbackUrl = "";
      const agent = useragent.parse(req.headers["user-agent"]);
      const platform = agent.os.toString();
      switch (platform) {
        case "Android":
          destinationUrl = doc.data().androidPrimary;
          fallbackUrl = doc.data().androidFallback;
          break;
        case "iOS":
          destinationUrl = doc.data().iosPrimary;
          fallbackUrl = doc.data().iosFallback;
          break;
        default:
          destinationUrl = doc.data().web;
      }
      links = [
        ...links,
        {
          shortLink: doc.data().shortLink,
          originalUrl: doc.data().web,
          destinationUrl: destinationUrl,
          fallbackUrl: fallbackUrl,
        },
      ];
    });
    console.log(links);
    res.status(200).json(links);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addLink = async (req, res) => {
  try {
    const validate = ajv.compile(linkSchema);
    const valid = validate(req.body);
    console.log(valid);
    if (!valid)
      return res.status(400).json({ message: "All fields are required" });
    const { ios, android, web } = req.body;
    const iosPrimary = ios.primary;
    const iosFallback = ios.fallback;
    const androidPrimary = android.primary;
    const androidFallback = android.fallback;
    const slug = req.body.slug
      ? req.body.slug
      : Math.floor(Math.random() * 999999999);
    const shortLink = await generateShortLink(web);
    await db
      .collection("shortLinks")
      .doc(`${slug}`)
      .set({
        slug: slug,
        shortLink: shortLink,
        iosPrimary: iosPrimary,
        iosFallback: iosFallback,
        androidPrimary: androidPrimary,
        androidFallback: androidFallback,
        web: web,
      })
      .catch((error) => res.status(500).json({ message: error }));

    res
      .status(201)
      .json({ message: `link added to database successfully ${shortLink}` });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
