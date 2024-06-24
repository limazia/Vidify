type GenerateImage = {
  text: string;
  id: string;
};

export async function GenerateImages({ text, id }: GenerateImage) {
  try {
    return { text, id };
  } catch (err) {
    console.error(err);
  }
}
