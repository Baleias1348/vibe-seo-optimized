// Página de muestra con 8 posts embebidos de distintas redes sociales sobre turismo y noticias de Chile
// Puedes cambiar los links por los que prefieras

import React from "react";

const posts = [
  {
    type: "instagram",
    url: "https://www.instagram.com/p/C6y6s4pP8eX/"
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/p/C7F2r6nN7qV/"
  },
  {
    type: "twitter",
    url: "https://twitter.com/Sernatur/status/1798373170956376278"
  },
  {
    type: "twitter",
    url: "https://twitter.com/ChileTravel/status/1798681799907715482"
  },
  {
    type: "youtube",
    url: "https://www.youtube.com/embed/2d5Zb6DkTnE"
  },
  {
    type: "youtube",
    url: "https://www.youtube.com/embed/6fM8l1A5J1k"
  },
  {
    type: "facebook",
    url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FChileTravel%2Fposts%2Fpfbid0q4tH1yqZ2Y2wTg3Vn6yT5w4u5b8vK2b6T8R7h7k5R2t1vR1w2h6u3y9u6w9w5y7y&show_text=true&width=500"
  },
  {
    type: "tiktok",
    url: "https://www.tiktok.com/embed/v2/7212433422433223982"
  }
];

function Embed({ type, url }) {
  if (type === "instagram") {
    return (
      <iframe
        src={url + "/embed"}
        className="w-full h-[480px] rounded-lg border"
        allow="encrypted-media"
        title="Instagram Post"
      ></iframe>
    );
  }
  if (type === "twitter") {
    return (
      <blockquote className="twitter-tweet">
        <a href={url}>Ver en Twitter</a>
      </blockquote>
    );
  }
  if (type === "youtube") {
    return (
      <iframe
        src={url}
        className="w-full h-[315px] rounded-lg border"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube Video"
      ></iframe>
    );
  }
  if (type === "facebook") {
    return (
      <iframe
        src={url}
        className="w-full h-[500px] rounded-lg border"
        style={{ maxWidth: 500 }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Post"
      ></iframe>
    );
  }
  if (type === "tiktok") {
    return (
      <iframe
        src={url}
        className="w-full h-[600px] rounded-lg border"
        allowFullScreen
        title="TikTok Video"
      ></iframe>
    );
  }
  return null;
}

export default function SocialPosts() {
  React.useEffect(() => {
    // Carga el script de Twitter solo si hay tweets
    if (posts.some(p => p.type === "twitter")) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Mejores Posts sobre Chile para Turistas
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Selección de publicaciones recientes de Instagram, Twitter, YouTube, Facebook y TikTok sobre turismo y noticias relevantes de Chile.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
            <Embed {...post} />
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 text-center mt-8">
        * Algunos embeds pueden requerir que el usuario acepte cookies o inicie sesión para visualizar el contenido.
      </div>
    </div>
  );
}
