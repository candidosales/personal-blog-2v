import fs from 'fs/promises';
import satori from 'satori';
import sharp from 'sharp';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async function get({ params, request }) {
  const inclusiveSansData = await fs.readFile(
    './public/fonts/InclusiveSans-Regular.ttf',
  );

  const newsReaderItalic = await fs.readFile(
    './public/fonts/Newsreader_14pt-MediumItalic.ttf',
  );

  const imageBase64 = (await fs.readFile('./public/me-2.png')).toString(
    'base64',
  );

  const pHello = {
    type: 'p',
    props: {
      children: "Hello! I'm Candido Sales",
      style: {
        color: '#1c64f2',
        fontSize: 35,
        marginBottom: 40,
        marginTop: 0,
        letterSpacing: -2,
      },
    },
  };

  const pMain1 = {
    type: 'p',
    props: {
      children: 'A multidisciplinary engineer',
      style: {
        color: '#1e429f',
        fontSize: 60,
        fontWeight: 700,
        marginBottom: 0,
        paddingBottom: 0,
        marginTop: 0,
        letterSpacing: -4,
      },
    },
  };
  const spanMain1 = {
    type: 'span',
    props: {
      children: 'focusing on',
      style: {
        color: '#1e429f',
        fontSize: 60,
        fontWeight: 700,
        marginBottom: 0,
        marginTop: 0,
        letterSpacing: -4,
        paddingBottom: 0,
      },
    },
  };

  const spanMain2 = {
    type: 'span',
    props: {
      children: 'digital experiences',
      style: {
        color: '#1e429f',
        fontSize: 60,
        fontWeight: 700,
        marginBottom: 0,
        marginTop: 5,
        marginLeft: 10,
        letterSpacing: -4,
        fontFamily: 'Newsreader',
        paddingBottom: 0,
      },
    },
  };

  const pMain2 = {
    type: 'p',
    props: {
      children: [spanMain1, spanMain2],
      style: {
        padding: 0,
        margin: 0,
      },
    },
  };

  const divText = {
    type: 'div',
    props: {
      children: [pHello, pMain1, pMain2],
      style: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
  };

  const image = {
    type: 'div',
    props: {
      style: {
        backgroundImage: `url('data:image/png;base64,${imageBase64}')`,
        backgroundClip: 'border-box',
        backgroundSize: `250px 250px`,
        marginRight: 40,
        borderRadius: 200,
        width: 250,
        height: 250,
      },
    },
  };

  const svg = await satori(
    {
      type: 'div',
      props: {
        children: [image, divText],
        style: {
          fontSize: 60,
          background: '#fff8f1',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        },
      },
    },
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Inclusive Sans',
          data: inclusiveSansData,
          style: 'normal',
        },
        {
          name: 'Newsreader',
          data: newsReaderItalic,
          style: 'italic',
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
