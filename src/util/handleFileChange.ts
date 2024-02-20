

export default function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string | undefined>>) {
    const imageFile = event.target.files![0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setUrl(reader.result! as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }