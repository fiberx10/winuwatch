
import {

  ref,
  uploadBytes,
  UploadResult,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import { useState } from "react";
import { faker } from "@faker-js/faker";
import Image from "next/image";

export default function TestPage() {
  const [file, setFile] = useState<File | undefined>();
  const [url, setUrl] = useState<string | undefined>();

  return (
    <div>
      {url ? (
        <div>
          <p>{url}</p>
          <Image
            alt="test" //this should be the name of the
            src={url}
            width={200}
            height={200}
          />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!file) return;
            const fileName = `test/${faker.datatype.uuid()}`;
            uploadBytes(ref(storage, fileName), file)
              .then(async(snapshot: UploadResult) => {
                const url = await getDownloadURL(snapshot.ref)
                setUrl(url);
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        >
          <input
            type="file"
            onChange={(e) => {
              if (!e.target.files || !e.target.files[0]) return;
              setFile(e.target.files[0]);
            }}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
