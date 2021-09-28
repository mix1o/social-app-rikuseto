import {
  Dispatch,
  FC,
  SetStateAction,
  useState,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
  useCallback,
} from 'react';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile';

interface Textarea {
  textValue: string;
  setTextValue: Dispatch<SetStateAction<string>>;
  handleAction: (e: MouseEvent<HTMLButtonElement>) => void;
  img?: string;
  placeholder?: string;
}

const CustomTextarea: FC<Textarea> = ({
  textValue,
  setTextValue,
  handleAction,
  img,
  placeholder = 'Aa',
}) => {
  const [openEmojiList, setOpenEmojiList] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rows, setRows] = useState(1);

  const onEmojiClick = (
    event: MouseEvent<Element, globalThis.MouseEvent>,
    emojiObject: IEmojiData
  ) => {
    setTextValue((prevState: string) => prevState + emojiObject.emoji);
    setErrorMessage('');
    setOpenEmojiList(!openEmojiList);
  };

  const validateInput = (e: MouseEvent<HTMLButtonElement>) => {
    if (
      textValue.length >= 2 ||
      (textValue.length >= 1 &&
        (/\d/.test(textValue) ||
          /[a-zA-Z]/g.test(textValue) ||
          /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(textValue)))
    ) {
      handleAction(e);
      setErrorMessage('');
      return;
    }
    setErrorMessage('Text must be at least 1 character');
  };

  const getRows = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const lineHeight = 21;
    const taHeight = e.target.scrollHeight;

    if (taHeight / lineHeight >= 2.1)
      setRows(Math.floor(taHeight / lineHeight)); //Po pierwszym znaku dodaje scollHeight
    return;
  }, []);

  return (
    <div className="textarea">
      {errorMessage && (
        <p data-testid="message" className="textarea__message">
          {errorMessage}
        </p>
      )}
      <div className="textarea__wrapper">
        {img && (
          <img
            src={img}
            alt="Current user profile"
            className="textarea__avatar"
          />
        )}
        <div className="textarea__content">
          <textarea
            data-testid="input-comments"
            className="textarea__input"
            value={textValue}
            placeholder={placeholder}
            rows={rows <= 5 ? rows : 5}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setTextValue(e.target.value);
              setErrorMessage('');
              getRows(e);
            }}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.code === 'Space' && textValue.length === 1) {
                setTextValue('');
              }
            }}
          />

          {/* <button
            className="textarea__emoji"
            onClick={() => setOpenEmojiList(prevState => !prevState)}
          >
            {openEmojiList ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faSmile} />
            )}
          </button> */}
        </div>
        <button
          data-testid="publish"
          className="textarea__publish"
          onClick={validateInput}
        >
          <i className="fas fa-location-arrow"></i>
        </button>
      </div>
      {openEmojiList && (
        <div>
          <Picker
            pickerStyle={{
              width: '100%',
              background: 'var(--light-bg-400)',
              boxShadow: 'none',
              border: '1px solid var(--font-dark-600)',
              marginTop: '1rem',
            }}
            disableSearchBar={true}
            onEmojiClick={onEmojiClick}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTextarea;
