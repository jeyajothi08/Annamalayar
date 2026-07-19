import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogType = 'website', 
  twitterCard = 'summary_large_image' 
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Set document title
    if (title) {
      document.title = title;
    }

    // 2. Set description meta tag
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
      
      // Also update primary meta[name="title"]
      let metaTitle = document.querySelector('meta[name="title"]');
      if (metaTitle && title) {
        metaTitle.setAttribute('content', title);
      }
    }

    // 3. Set canonical link
    const currentUrl = canonicalUrl || `https://annamalaiyarrecovery.in${location.pathname}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 4. Set Open Graph tags
    const ogTags = {
      'og:title': ogTitle || title,
      'og:description': ogDescription || description,
      'og:url': currentUrl,
      'og:type': ogType,
      'og:image': ogImage || 'https://annamalaiyarrecovery.in/towing-team.png',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      }
    });

    // 5. Set Twitter tags
    const twitterTags = {
      'twitter:card': twitterCard,
      'twitter:title': ogTitle || title,
      'twitter:description': ogDescription || description,
      'twitter:image': ogImage || 'https://annamalaiyarrecovery.in/towing-team.png',
      'twitter:url': currentUrl,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      }
    });
  }, [title, description, canonicalUrl, ogTitle, ogDescription, ogImage, ogType, twitterCard, location.pathname]);

  return null;
};

export default SEO;
