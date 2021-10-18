import { FC } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

const ShareButton: FC<{ link: string }> = ({ link }) => {
  return (
    <>
      <div className="post__container-socials">
        <FacebookShareButton url={link}>
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>
        <RedditShareButton url={link}>
          <RedditIcon size={40} round={true} />
        </RedditShareButton>
        <WhatsappShareButton url={link}>
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>
        <TelegramShareButton url={link}>
          <TelegramIcon size={40} round={true} />
        </TelegramShareButton>
        <TwitterShareButton url={link}>
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>
        <EmailShareButton url={link}>
          <EmailIcon size={40} round={true} />
        </EmailShareButton>
      </div>
      <p className="post__share-info">Or just copy link</p>
      <div className="post__container-link">
        <a href={link} className="post__link">
          {link}
        </a>
      </div>

      <button
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
        className="post__btn-copy"
      >
        Copy link
        <i className="far fa-copy"></i>
      </button>
    </>
  );
};

export default ShareButton;
