import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";
import type { APIRoute } from "astro";

export const get: APIRoute = async function get({ params, request }) {
  const interData = await fs.readFile(
    "./public/fonts/inter-latin-400-normal.ttf"
  );

  const pHello = {
    type: "p",
    props: {
      children: "Hello! I'm Candido Sales",
      style: {
        color: "#64748b",
        fontSize: 35,
        marginBottom: 40,
        marginTop: 0,
        letterSpacing: -2,
      },
    },
  };

  const pMain1 = {
    type: "p",
    props: {
      children: "A multidisciplinary engineer",
      style: {
        color: "#1e293b",
        fontSize: 60,
        fontWeight: 700,
        marginBottom: 0,
        marginTop: 0,
        letterSpacing: -2,
      },
    },
  };
  const pMain2 = {
    type: "p",
    props: {
      children: "focusing on digital experiences",
      style: {
        color: "#1e293b",
        fontSize: 60,
        fontWeight: 700,
        marginBottom: 0,
        marginTop: 0,
        letterSpacing: -2,
      },
    },
  };

  const divText = {
    type: "div",
    props: {
      children: [pHello, pMain1, pMain2],
      style: {
        display: "flex",
        flexDirection: "column",
      },
    },
  };

  const image = {
    type: "img",
    props: {
      src: "https://www.candidosales.me/me-2.png",
      style: {
        display: "flex",
        flexDirection: "column",
        marginRight: 40,
        borderRadius: 200,
      },
      width: 250,
      height: 250,
    },
  };

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [image, divText],
        style: {
          fontSize: 60,
          background: "#fff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
        },
      },
    },
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: interData,
          weight: "normal",
          style: "normal",
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
