import React from 'react';
import {
    FacebookShareButton,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
    EmailShareButton,
    EmailIcon,
} from 'next-share';

const Footer: React.FC = () => {
    return (
        <div className='bg-gray-600 text-center mt-auto'>
            <div className='p-4 pb-0 bg-gray-600'>
                <section className='mb-4 space-x-4'>
                    <FacebookShareButton
                        url={'https://www.youtube.com/@chielokacodes?sub_confirmation=1'}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    
                    <WhatsappShareButton
                        url={'https://wa.link/lxae1v'}
                    >
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    
                    <LinkedinShareButton
                        url={'http://linkedin.com/in/chieloka-madubugwu-java'}
                    >
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <EmailShareButton
                        url={'madubugwuchieloka6@gmail.com'}
                    >
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </section>
            </div>

            <div className='text-center p-3 text-black bg-gray-500'>
                © 2024 Copyright: ChielokaCodes
            </div>
        </div>
    );
};

export default Footer;
