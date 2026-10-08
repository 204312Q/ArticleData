// ----------------------------------------------------------------------

export type LegalListItem = {
  text: string;
  subItems?: string[];
};

export type LegalSection = {
  heading: string;
  items: LegalListItem[];
};

export type LegalDocument = {
  title: string;
  intro: string[];
  sections: LegalSection[];
  effectiveDate?: string;
  lastUpdated: string;
};

// ----------------------------------------------------------------------

export const termsOfUse: LegalDocument = {
  title: 'Terms of Use',
  intro: [
    `By using any of the websites (each a 'Site') operated by or for and on behalf of Chilli Padi Holding Pte Ltd and all its subsidiary companies, you shall be deemed to have accepted and be legally bound by these Terms of Use. If you do not agree to these Terms of Use, you may not access or otherwise use the Sites or the Services.`,
  ],
  sections: [
    {
      heading: 'General',
      items: [
        {
          text: 'These Terms of Use may be changed from time to time. Changes will be posted on this page and your use of this website after such changes have been posted will constitute your agreement to the modified Terms of Use and all of the changes.',
        },
      ],
    },
    {
      heading: 'Proprietary Rights',
      items: [
        {
          text: `This website is maintained by Chilli Padi Holding Pte Ltd (thereafter referred to as 'Chilli Padi').`,
        },
        {
          text: `The materials located on this website including the information and software programs ('the Contents'), are protected by copyright, trademark and other forms of proprietary rights. All rights, title and interest in the Contents are owned by, licensed to or controlled by Chilli Padi.`,
        },
      ],
    },
    {
      heading: 'Privacy Policy',
      items: [
        {
          text: `Your use of this website is subject to Chilli Padi's Privacy Policy and Data Protection Notice.`,
        },
      ],
    },
    {
      heading: 'Restrictions on use of Materials',
      items: [
        {
          text: 'Except as otherwise provided, the Contents of this website shall not be reproduced, republished, uploaded, posted, transmitted or otherwise distributed in any way, without the prior written permission of Chilli Padi.',
        },
        {
          text: `Modification of any of the Contents or use of the Contents for any other purpose will be a violation of Chilli Padi's copyright and other intellectual property rights. Graphics and images on this website are protected by copyright and may not be reproduced or appropriated in any manner without written permission of Chilli Padi.`,
        },
      ],
    },
    {
      heading: 'Disclaimer of Warranties and Liability',
      items: [
        {
          text: 'The Contents of this website are provided on an "as is" basis without warranties of any kind. To the fullest extent permitted by law, Chilli Padi does not warrant and hereby disclaims any warranty:',
          subItems: [
            'as to the accuracy, correctness, reliability, timeliness, non-infringement, title, merchantability or fitness for any particular purpose of the Contents of this website;',
            'that the Contents available through this website or any functions associated therewith will be uninterrupted or error-free, or that defects will be corrected or that this website and the server is and will be free of all viruses and/or other harmful elements.',
          ],
        },
        {
          text: 'Chilli Padi shall also not be liable for any damage or loss of any kind caused as a result (direct or indirect) of the use of the website, including but not limited to any damage or loss suffered as a result of reliance on the Contents contained in or available from the website.',
        },
      ],
    },
    {
      heading: 'Right of Access',
      items: [
        {
          text: 'Chilli Padi reserves all rights to deny or restrict access to this website to any particular person, or to block access from a particular Internet address to this website, at any time, without ascribing any reasons whatsoever.',
        },
      ],
    },
    {
      heading: 'Links from this website to other websites',
      items: [
        {
          text: 'This website contains hyperlinks to websites which are not maintained by Chilli Padi. Chilli Padi is not responsible for the contents of those websites and shall not be liable for any damages or loss arising from access to those websites. Use of the hyperlinks and access to such websites are entirely at your own risk.',
        },
        {
          text: 'Hyperlinks to other websites are provided as a convenience. In no circumstances shall Chilli Padi be considered to be associated or affiliated with any trade or service marks, logos, insignia or other devices used or appearing on websites to which this website is linked.',
        },
      ],
    },
    {
      heading: 'Links to this website from other websites',
      items: [
        {
          text: 'Except as set forth below, caching and links to, and the framing of this website or any of the Contents are prohibited.',
        },
        {
          text: 'You must secure permission from Chilli Padi prior to hyperlinking to, or framing, this website or any of the Contents, or engaging in similar activities. Chilli Padi reserves the right to impose conditions when permitting any hyperlinking to, or framing of this website or any of the Contents.',
        },
        {
          text: 'Your linking to, or framing any part of this website or its Contents constitute acceptance of these Terms of Use. This is deemed to be the case even after the posting of any changes or modifications to these Terms of Use. If you do not accept these Terms of Use, you must discontinue linking to, or framing of this website or any of the Contents.',
        },
        {
          text: 'In no circumstances shall Chilli Padi be considered to be associated or affiliated in whatever manner with any trade or service marks, logos, insignia or other devices used or appearing on web the Contents.',
        },
        {
          text: 'Chilli Padi reserves all rights to disable any links to, or frames of any site containing inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topics, names, material or information, or material or information that violates any written law, any applicable intellectual property, proprietary, privacy or publicity rights.',
        },
        {
          text: 'Chilli Padi reserves the right to disable any unauthorised links or frames and disclaims any responsibility for the content available on any other site reached by links to or from this website or any of the Contents.',
        },
      ],
    },
    {
      heading: 'Governing Law',
      items: [
        {
          text: 'These Terms of Use shall be governed and construed in accordance with laws of the Republic of Singapore.',
        },
      ],
    },
  ],
  lastUpdated: '07/01/2020',
};

// ----------------------------------------------------------------------

export const dataProtectionNotice: LegalDocument = {
  title: 'Data Protection Notice for Customers',
  intro: [
    `This Data Protection Notice ("Notice") sets out the basis which Chilli Padi Nonya Restaurant Pte Ltd ("we", "us", or "our") may collect, use, disclose or otherwise process personal data of our customers in accordance with the Personal Data Protection Act ("PDPA"). This Notice applies to personal data in our possession or under our control, including personal data in the possession of organisations which we have engaged to collect, use, disclose or process personal data for our purposes.`,
  ],
  sections: [
    {
      heading: 'Personal Data',
      items: [
        {
          text: `As used in this Notice:\n\n"customer" means an individual who (a) has contacted us through any means to find out more about any goods or services we provide, or (b) may, or has, entered into a contract with us for the supply of any goods or services by us; and\n\n"personal data" means data, whether true or not, about a customer who can be identified: (a) from that data; or (b) from that data and other information to which we have or are likely to have access.`,
        },
        {
          text: 'Depending on the nature of your interaction with us, some examples of personal data which we may collect from you include name, residential address, email address and telephone number.',
        },
        {
          text: 'Other terms used in this Notice shall have the meanings given to them in the PDPA (where the context so permits).',
        },
      ],
    },
    {
      heading: 'Collection, Use and Disclosure of Personal Data',
      items: [
        {
          text: `We generally do not collect your personal data unless (a) it is provided to us voluntarily by you directly or via a third party who has been duly authorised by you to disclose your personal data to us (your "authorised representative") after (i) you (or your authorised representative) have been notified of the purposes for which the data is collected, and (ii) you (or your authorised representative) have provided written consent to the collection and usage of your personal data for those purposes, or (b) collection and use of personal data without consent is permitted or required by the PDPA or other laws. We shall seek your consent before collecting any additional personal data and before using your personal data for a purpose which has not been notified to you (except where permitted or authorised by law).`,
        },
        {
          text: 'We may collect and use your personal data for any or all of the following purposes:',
          subItems: [
            'performing obligations in the course of or in connection with our provision of the goods and/or services requested by you;',
            'verifying your identity;',
            'responding to, handling, and processing queries, requests, applications, complaints, and feedback from you; and',
            'managing your relationship with us.',
          ],
        },
        {
          text: 'We may disclose your personal data:',
          subItems: [
            'where such disclosure is required for performing obligations in the course of or in connection with our provision of the goods and services requested by you.',
          ],
        },
        {
          text: 'The purposes listed in the above clauses may continue to apply even in situations where your relationship with us (for example, pursuant to a contract) has been terminated or altered in any way, for a reasonable period thereafter (including, where applicable, a period to enable us to enforce our rights under a contract with you).',
        },
      ],
    },
    {
      heading: 'Withdrawing Your Consent',
      items: [
        {
          text: 'The consent that you provide for the collection, use and disclosure of your personal data will remain valid until such time it is being withdrawn by you in writing. You may withdraw consent and request us to stop collecting, using and/or disclosing your personal data for any or all of the purposes listed above by submitting your request in writing or via email to our Data Protection Officer at the contact details provided below.',
        },
        {
          text: 'Upon receipt of your written request to withdraw your consent, we may require reasonable time (depending on the complexity of the request and its impact on our relationship with you) for your request to be processed and for us to notify you of the consequences of us acceding to the same, including any legal consequences which may affect your rights and liabilities to us. In general, we shall seek to process your request within ten (10) business days of receiving it.',
        },
        {
          text: 'Whilst we respect your decision to withdraw your consent, please note that depending on the nature and scope of your request, we may not be in a position to continue providing our goods or services to you and we shall, in such circumstances, notify you before completing the processing of your request. Should you decide to cancel your withdrawal of consent, please inform us in writing in the manner described in clause 8 above.',
        },
        {
          text: 'Please note that withdrawing consent does not affect our right to continue to collect, use and disclose personal data where such collection, use and disclose without consent is permitted or required under applicable laws.',
        },
      ],
    },
    {
      heading: 'Access to and Correction of Personal Data',
      items: [
        {
          text: 'If you wish to make (a) an access request for access to a copy of the personal data which we hold about you or information about the ways in which we use or disclose your personal data, or (b) a correction request to correct or update any of your personal data which we hold about you, you may submit your request in writing or via email to our Data Protection Officer at the contact details provided below.',
        },
        {
          text: 'Please note that a reasonable fee may be charged for an access request. If so, we will inform you of the fee before processing your request.',
        },
        {
          text: 'We will respond to your request as soon as reasonably possible. In general, our response will be within thirty (30) business days. Should we not be able to respond to your request within thirty (30) days after receiving your request, we will inform you in writing within thirty (30) days of the time by which we will be able to respond to your request. If we are unable to provide you with any personal data or to make a correction requested by you, we shall generally inform you of the reasons why we are unable to do so (except where we are not required to do so under the PDPA).',
        },
      ],
    },
    {
      heading: 'Protection of Personal Data',
      items: [
        {
          text: 'To safeguard your personal data from unauthorised access, collection, use, disclosure, copying, modification, disposal or similar risks, we have introduced appropriate administrative, physical and technical measures such as minimised collection of personal data, encryption of data, up-to-date antivirus protection, regular patching of operating system and other software, web security measures against risks, usage of one time password (OTP) / 2 factor authentication (2FA) / multi-factor authentication (MFA) to secure access, and security review and testing performed regularly.',
        },
        {
          text: 'You should be aware, however, that no method of transmission over the Internet or method of electronic storage is completely secure. While security cannot be guaranteed, we strive to protect the security of your information and are constantly reviewing and enhancing our information security measures.',
        },
      ],
    },
    {
      heading: 'Accuracy of Personal Data',
      items: [
        {
          text: 'We generally rely on personal data provided by you (or your authorised representative). In order to ensure that your personal data is current, complete and accurate, please update us if there are changes to your personal data by informing our Data Protection Officer in writing or via email at the contact details provided below.',
        },
      ],
    },
    {
      heading: 'Retention of Personal Data',
      items: [
        {
          text: 'We may retain your personal data for as long as it is necessary to fulfil the purpose for which it was collected, or as required or permitted by applicable laws.',
        },
        {
          text: 'We will cease to retain your personal data, or remove the means by which the data can be associated with you, as soon as it is reasonable to assume that such retention no longer serves the purpose for which the personal data was collected, and is no longer necessary for legal or business purposes.',
        },
      ],
    },
    {
      heading: 'Transfers of Personal Data Outside of Singapore',
      items: [
        {
          text: 'We generally do not transfer your personal data to countries outside of Singapore. However, if we do so, we will obtain your consent for the transfer to be made and we will take steps to ensure that your personal data continues to receive a standard of protection that is at least comparable to that provided under the PDPA.',
        },
      ],
    },
    {
      heading: 'Data Protection Officer',
      items: [
        {
          text: 'You may contact our Data Protection Officer if you have any enquiries or feedback on our personal data protection policies and procedures, or if you wish to make any request, in the following manner:\n\nName of DPO: Tan Chong Lee\nContact No.: 69149900\nEmail Address: dpo@chillipadi.com.sg',
        },
      ],
    },
    {
      heading: 'Effect of Notice and Changes to Notice',
      items: [
        {
          text: 'This Notice applies in conjunction with any other notices, contractual clauses and consent clauses that apply in relation to the collection, use and disclosure of your personal data by us.',
        },
        {
          text: 'We may revise this Notice from time to time without any prior notice. You may determine if any such revision has taken place by referring to the date on which this Notice was last updated. Your continued use of our services constitutes your acknowledgement and acceptance of such changes.',
        },
      ],
    },
  ],
  effectiveDate: '06/08/2026',
  lastUpdated: '06/08/2026',
};
