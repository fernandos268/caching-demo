const mappings = (thinkyType, type) => {
  return {
    string: thinkyType.string(),

  }[type];
}

export default (fields = [], type) => {
  return fields.reduce((acc, curr) => {
    let built = type[curr.type]();
    if (curr.default) {
      built = built.default(curr.default);
    }
    if (curr.required) {
      built = built.required();
    }
    // console.log({ curr, built });
    return { ...acc, [curr.name]: built }
  }, {})
}