import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
} from 'firebase/auth';
import { createClient } from 'next-sanity';
import Image from 'next/image';
import logoicon from '../../public/assets/images/googleLogoIcon.png';
import imageUrlBuilder from '@sanity/image-url';
import { FaBullseye } from 'react-icons/fa';

export default function Home({ fruits }) {
  console.log(process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY);

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);

  // const analytics = getAnalytics(app);
  const analytics = () => {
    if (typeof window !== 'undefined') {
      return getAnalytics(app);
    } else {
      return null;
    }
  };

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  // onAuthStateChanged(auth, (user) => {
  //   console.log(user);
  // });
  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log(result);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

  function handleClick() {
    signInWithPopup(auth, provider);
    // signInWithRedirect(auth, provider);
  }

  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });

  return (
    <>
      <div className="container mx-auto bg-red-600 text-center p-2">
        <h1 className="text-6xl text-white">Foodle</h1>
        <p className="text-2xl text-white p-1">
          What food item do you want to find today?
        </p>
      </div>

      <div
        className="flex gap-4 place-items-center justify-center mt-8 border-2 mx-2 p-2 hover:cursor-pointer hover:bg-purpleLight hover:text-white transition duration-500"
        onClick={handleClick}
      >
        <Image src={logoicon} width="20px" height="20px" />
        <p className="capitalize text-xl font-openSans">
          login <span className="lowercase">with</span> google
        </p>
      </div>

      <div className="container mx-auto">
        <h2 className="text-3xl m-2 underline underline-offset-4">Fruits</h2>
        <div>
          {fruits.length > 0 && (
            <div>
              {fruits?.map((item) => (
                <div key={item._id} className="flex flex-col m-4">
                  <div>
                    <h3 className="font-bold text-xl">{item?.name}</h3>
                    <h2 className="font-medium">Local Names :</h2>
                    <ul className="p-2">
                      {item.local_names.map((item, i) => (
                        <li key={i} className="flex place-items-center gap-1">
                          <FaBullseye />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-96 h-96">
                    <img
                      src={urlFor(item.picture).url()}
                      alt={'a picture of ' + item.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!fruits.length > 0 && <p>Nothing to show</p>}
        </div>
      </div>
    </>
  );
}

const client = createClient({
  projectId: '4bj9tdn7',
  dataset: 'production',
  apiVersion: '2022-07-29',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export async function getStaticProps() {
  const fruits = await client.fetch(`*[_type == "fruits"]`);

  return {
    props: {
      fruits,
    },
  };
}
