(function () {
  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && typeof value === "string") {
      element.textContent = value;
    }
  }

  function setImage(id, src, fallbackAlt) {
    var element = document.getElementById(id);
    if (element && typeof src === "string" && src.length > 0) {
      element.setAttribute("src", src);
      element.style.display = "";
      if (fallbackAlt && !element.getAttribute("alt")) {
        element.setAttribute("alt", fallbackAlt);
      }
    }
  }

  function renderChecklist(items) {
    if (!Array.isArray(items)) {
      return;
    }

    var leftList = document.getElementById("service-checklist-left");
    var rightList = document.getElementById("service-checklist-right");

    if (!leftList || !rightList) {
      return;
    }

    var midpoint = Math.ceil(items.length / 2);
    var leftItems = items.slice(0, midpoint);
    var rightItems = items.slice(midpoint);

    leftList.innerHTML = leftItems.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");

    rightList.innerHTML = rightItems.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");
  }

  function getServiceIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function findServiceById(services, serviceId) {
    if (!Array.isArray(services)) {
      return null;
    }

    var exactMatch = services.find(function (service) {
      return service.id === serviceId;
    });

    if (exactMatch) {
      return exactMatch;
    }

    return services.length > 0 ? services[0] : null;
  }

  function injectSeoTags(seo) {
    if (!seo) return;

    if (seo.metaTitle) {
      document.title = seo.metaTitle;
      var ogTitle = document.querySelector('meta[property="og:title"]');
      var twTitle = document.querySelector('meta[name="twitter:title"]');
      if (ogTitle) ogTitle.setAttribute("content", seo.metaTitle);
      if (twTitle) twTitle.setAttribute("content", seo.metaTitle);
    }

    if (seo.metaDescription) {
      var desc = document.querySelector('meta[name="description"]');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      var twDesc = document.querySelector('meta[name="twitter:description"]');
      if (desc) desc.setAttribute("content", seo.metaDescription);
      if (ogDesc) ogDesc.setAttribute("content", seo.metaDescription);
      if (twDesc) twDesc.setAttribute("content", seo.metaDescription);
    }

    if (seo.metaKeywords) {
      var keywords = document.querySelector('meta[name="keywords"]');
      if (keywords) {
        keywords.setAttribute("content", seo.metaKeywords);
      } else {
        var kw = document.createElement("meta");
        kw.setAttribute("name", "keywords");
        kw.setAttribute("content", seo.metaKeywords);
        document.head.appendChild(kw);
      }
    }

    if (seo.canonicalUrl) {
      var canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", seo.canonicalUrl);
      } else {
        var link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", seo.canonicalUrl);
        document.head.appendChild(link);
      }
      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute("content", seo.canonicalUrl);
      }
    }
  }

  function renderService(service) {
    if (!service) {
      return;
    }

    injectSeoTags(service.seo);
    setText("service-page-title", service.pageTitle);
    setImage("service-main-banner-image", service.mainBannerImage, "Service main banner");
    setText("service-main-heading", service.mainHeading);
    setText("service-intro-paragraph", service.introParagraph);

    if (service.overview) {
      setText("service-overview-paragraph", service.overview.paragraph);

      if (Array.isArray(service.overview.images)) {
        setImage("service-overview-image-1", service.overview.images[0], "Service overview image 1");
        setImage("service-overview-image-2", service.overview.images[1], "Service overview image 2");
      }
    }

    if (service.whatsIncluded) {
      setText("service-included-paragraph", service.whatsIncluded.paragraph);
      renderChecklist(service.whatsIncluded.checklist);
    }
  }

  async function loadServiceData() {
    try {
      var serviceId = getServiceIdFromUrl();

      if (!serviceId) {
        window.location.replace("service/");
        return;
      }

      var response = await fetch("data/services.json", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Failed to load service data JSON");
      }

      var payload = await response.json();
      var service = findServiceById(payload.services, serviceId);

      if (!service) {
        console.warn("No services found in services.json");
        return;
      }

      renderService(service);
    } catch (error) {
      console.error("Service data load error:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", loadServiceData);
})();
