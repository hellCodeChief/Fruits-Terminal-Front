const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const imgSrcCreator = (_picId, _usage) => {
  const url = `${BASE_URL}/files/${_picId}/${_usage}`;

  return url;
};
