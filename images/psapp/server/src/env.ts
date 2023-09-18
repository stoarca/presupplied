export let env = new Proxy(process.env, {
  get(target, prop) {
    if (prop in target) {
      return target[prop as keyof typeof target];
    } else {
      throw new Error(`Environment variable '${String(prop)}' not found`);
    }
  }
});

