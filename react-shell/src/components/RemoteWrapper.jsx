import React, { Suspense, useEffect, useState } from "react";

const loadRemoteComponent = async ({ remoteUrl, scope, module }) => {
  await __webpack_init_sharing__("default");

  if (!window[scope]) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = remoteUrl;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        console.log(`${scope} loaded from ${remoteUrl}`);
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Failed to load remote script: ${remoteUrl}`));
      };

      document.head.appendChild(script);
    });
  }

  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);

  const factory = await container.get(module);
  const Module = factory();

  return Module;
};

const RemoteWrapper = ({ remoteUrl, scope, module }) => {
  const [RemoteComponent, setRemoteComponent] = useState(null);
  console.log("Loading remote component with:");
  console.log("remoteUrl:", remoteUrl);
  console.log("scope:", scope);
  console.log("module:", module);

  useEffect(() => {
    loadRemoteComponent({ remoteUrl, scope, module })
      .then((Component) => {
        const Loaded = Component?.default || Component;
        setRemoteComponent(() => Loaded);
      })
      .catch((error) => {
        console.error("Error loading remote component:", error);
      });
  }, [remoteUrl, scope, module]);

  if (!RemoteComponent) {
    return <div>Loading Remote App...</div>;
  }

  return (
    <Suspense fallback={<div>Loading remote component...</div>}>
      <RemoteComponent />
    </Suspense>
  );
};

export default RemoteWrapper;
