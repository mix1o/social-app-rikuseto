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
import {
  PostContainerSocials,
  ButtonCopy,
  PostSocialText,
  PostSocialLink,
} from './styled';

const PostShareSocials: FC<{ id: string }> = ({ id }) => {
  const link = `${process.env.REACT_APP_POST_SHARE_LINK}${id}`;
  return (
    <PostContainerSocials>
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
      <PostSocialText>Or just copy link</PostSocialText>
      <div>
        <PostSocialLink href={link} className="post__link">
          {link}
        </PostSocialLink>
      </div>

      <ButtonCopy
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
      >
        Copy link
        <i className="far fa-copy"></i>
      </ButtonCopy>
    </PostContainerSocials>
  );
};

export default PostShareSocials;
