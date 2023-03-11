import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { TextInput } from '../common/inputs/textInput';
import { CgClose } from 'react-icons/cg';

interface RedirectInputItemProps {
  i: number,
  domain: string,
  setRedirectUriList: Dispatch<SetStateAction<{uri: string, key: string}[]>>
  value?: string
}

const RedirectInputItem = ({
  i,
  domain,
  setRedirectUriList,
  value
}: RedirectInputItemProps) => {
  const [redirectUri, setRedirectUri] = useState(''); 

  useEffect(() => {
    if (value) setRedirectUri(value);
  }, [value]);

  useEffect(() => {
    setRedirectUriList(prev => [
      ...prev.slice(0, i),
      {
        key: prev[i].key,
        uri: redirectUri
      },
      ...prev.slice(i + 1)
  ])
  }, [redirectUri]);

  const removeRedirect = () => setRedirectUriList(prev => [
    ...prev.slice(0, i),
    ...prev.slice(i + 1)
  ]);

  return (
    <li>
      <TextInput
        setCallback={setRedirectUri}
        value={redirectUri}
        placeholder="리다이렉트 URI"
        maxLength={100}
        pattern={`(https?://)(${domain}|localhost)(:(6[0-5]{2}[0-3][0-5]|[1-5][0-9]{4}|[1-9][0-9]{0,3}))?/.*`}
        required
        full
      />
      <CgClose onClick={removeRedirect} size={36} color='#c0c0c0' />
    </li>
  );
}

export default RedirectInputItem;