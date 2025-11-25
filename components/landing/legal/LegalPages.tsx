import React from 'react';

interface LegalPagesProps {
    page: string;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ page }) => {
    const renderContent = () => {
        switch (page) {
            case 'privacy-policy':
                return (
                    <div className="prose prose-invert max-w-none">
                        <h1>PRIVACY POLICY</h1>
                        <p className="text-sm text-gray-400 mb-8">Last updated November 24, 2025</p>

                        <p>This privacy notice for AlgoGuardian ("we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Visit our website at <a href="https://algoguardian.com" className="text-primary-400 hover:text-primary-300">https://algoguardian.com</a>, or any website of ours that links to this privacy notice</li>
                            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
                        </ul>

                        <h2>PERSONAL INFORMATION THAT WE COLLECT</h2>
                        <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>

                        <h3>Personal Information Provided by You.</h3>
                        <p>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Names</li>
                            <li>Emails</li>
                            <li>Usernames</li>
                            <li>Passwords</li>
                        </ul>

                        <h3>Payment Data.</h3>
                        <p>We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">https://stripe.com/privacy</a>.</p>
                        <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>

                        <h2>HOW DO WE PROCESS YOUR INFORMATION?</h2>
                        <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                            <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
                            <li><strong>To send administrative information to you.</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
                            <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.</li>
                            <li><strong>To send you marketing and promotional communications.</strong> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can unsubscribe from our marketing and promotional communications at any time by Clicking the unsubscribe link on our marketing emails, or by contacting us.</li>
                        </ul>

                        <h2>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
                        <p>We may need to share your personal information in the following situations:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                        </ul>

                        <h2>DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
                        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>
                        <p>Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
                        <p>We may share your information with Google Analytics to track and analyze the use of the Services. To opt out of being tracked by Google Analytics across the Services, visit <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">https://tools.google.com/dlpage/gaoptout</a>. For more information on the privacy practices of Google, please visit the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Google Privacy & Terms page</a>.</p>

                        <h2>HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
                        <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>
                        <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>

                        <h2>ACCOUNT INFORMATION</h2>
                        <p>If you would at any time like to review or change the information in your account or terminate your account, you can log in to your account settings and update your user account, or contact us using the contact information provided.</p>
                        <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>

                        <h2>DO WE COLLECT INFORMATION FROM MINORS?</h2>
                        <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.</p>

                        <h2>DO WE MAKE UPDATES TO THIS NOTICE?</h2>
                        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>

                        <h2>CONTACT US</h2>
                        <p>For more information about our privacy policy practice, if you have any questions, or if you would like to make a complaint, you may contact us at <a href="mailto:support@algoguardian.com" className="text-primary-400 hover:text-primary-300">support@algoguardian.com</a>.</p>
                    </div>
                );
            case 'terms-of-use':
                return (
                    <div className="prose prose-invert max-w-none">
                        <h1>TERMS OF USE</h1>
                        <p className="text-sm text-gray-400 mb-8">Last updated November 24, 2025</p>

                        <p>We are AlgoGuardian ("Company," "we," "us," "our"). We operate the website <a href="https://algoguardian.com" className="text-primary-400 hover:text-primary-300">https://algoguardian.com</a> (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").</p>
                        <p>You can contact us by email at <a href="mailto:support@algoguardian.com" className="text-primary-400 hover:text-primary-300">support@algoguardian.com</a>.</p>
                        <p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and AlgoGuardian, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                        <p>Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.</p>
                        <p>The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.</p>

                        <h2>INTELLECTUAL PROPERTY RIGHTS</h2>
                        <p>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").</p>
                        <p>Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.</p>
                        <p>The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.</p>
                        <p>Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use.</p>
                        <p>Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>
                        <p>We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.</p>
                        <p>Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</p>

                        <h2>USER REPRESENTATIONS</h2>
                        <p>By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (6) you will not use the Services for any illegal or unauthorized purpose; and (7) your use of the Services will not violate any applicable law or regulation.</p>
                        <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).</p>

                        <h2>USER REGISTRATION</h2>
                        <p>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>

                        <h2>PURCHASES AND PAYMENT</h2>
                        <p>We accept the following forms of payment:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Credit card</li>
                        </ul>
                        <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in US dollars.</p>
                        <p>You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.</p>

                        <h2>SUBSCRIPTIONS</h2>
                        <h3>Billing and Renewal</h3>
                        <p>Your subscription will continue and automatically renew unless canceled. You consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge, until such time as you cancel the applicable order. The length of your billing cycle will depend on the type of subscription plan you choose when you subscribed to the Services.</p>

                        <h3>Cancellation</h3>
                        <p>All purchases are non-refundable. You can cancel your subscription at any time by logging into your account. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with our Services, please email us at <a href="mailto:support@algoguardian.com" className="text-primary-400 hover:text-primary-300">support@algoguardian.com</a>.</p>

                        <h3>Fee Changes</h3>
                        <p>We may, from time to time, make changes to the subscription fee and will communicate any price changes to you in accordance with applicable law.</p>

                        <h2>PROHIBITED ACTIVITIES</h2>
                        <p>You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                        <p>As a user of the Site, you agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</li>
                            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
                            <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
                            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
                            <li>Engage in unauthorized framing of or linking to the Services.</li>
                            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</li>
                            <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                            <li>Delete the copyright or other proprietary rights notice from any Content.</li>
                            <li>Attempt to impersonate another user or person or use the username of another user.</li>
                            <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").</li>
                            <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</li>
                            <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</li>
                            <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</li>
                            <li>Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
                            <li>Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.</li>
                            <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorized script or other software.</li>
                            <li>Use a buying agent or purchasing agent to make purchases on the Services.</li>
                            <li>Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                            <li>Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                            <li>Sell or otherwise transfer your profile.</li>
                            <li>Use the Services to advertise or offer to sell goods and services.</li>
                        </ul>

                        <h2>THIRD-PARTY WEBSITES AND CONTENT</h2>
                        <p>The Services may contain (or you may be sent via the Site) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party. You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.</p>

                        <h2>SERVICES MANAGEMENT</h2>
                        <p>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</p>

                        <h2>PRIVACY POLICY</h2>
                        <p>We care about data privacy and security. Please review our Privacy Policy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in the United States. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in the United States, then through your continued use of the Services, you are transferring your data to the United States, and you expressly consent to have your data transferred to and processed in the United States.</p>

                        <h2>TERM AND TERMINATION</h2>
                        <p>These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.</p>
                        <p>If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.</p>

                        <h2>MODIFICATIONS AND INTERRUPTIONS</h2>
                        <p>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</p>
                        <p>We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.</p>

                        <h2>GOVERNING LAW</h2>
                        <p>These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of the State of Wyoming applicable to agreements made and to be entirely performed within the State of Wyoming, without regard to its conflict of law principles.</p>

                        <h2>CORRECTIONS</h2>
                        <p>There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</p>

                        <h2>LIMITATIONS OF LIABILITY</h2>
                        <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.</p>

                        <h2>INDEMNIFICATION</h2>
                        <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.</p>

                        <h2>USER DATA</h2>
                        <p>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.</p>

                        <h2>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
                        <p>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.</p>

                        <h2>MISCELLANEOUS</h2>
                        <p>These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.</p>
                    </div>
                );
            case 'disclaimer':
                return (
                    <div className="prose prose-invert max-w-none">
                        <h1>DISCLAIMER</h1>
                        <p className="text-sm text-gray-400 mb-8">Last updated November 24, 2025</p>

                        <h2>WEBSITE DISCLAIMER</h2>
                        <p>The information provided by AlgoGuardian ("we," "us," or "our") on <a href="https://algoguardian.com" className="text-primary-400 hover:text-primary-300">https://algoguardian.com</a> and <a href="https://app.algoguardian.com" className="text-primary-400 hover:text-primary-300">https://app.algoguardian.com</a> (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.</p>

                        <h2>EXTERNAL LINKS DISCLAIMER</h2>
                        <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.</p>
                    </div>
                );
            case 'cookie-policy':
                return (
                    <div className="prose prose-invert max-w-none">
                        <h1>COOKIE POLICY</h1>
                        <p className="text-sm text-gray-400 mb-8">Last updated November 24, 2025</p>

                        <p>This Cookie Policy explains how AlgoGuardian ("we," "us," or "our") uses cookies and similar technologies to recognize you when you visit our website at <a href="https://algoguardian.com" className="text-primary-400 hover:text-primary-300">https://algoguardian.com</a> ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
                        <p>In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.</p>

                        <h2>WHAT ARE COOKIES?</h2>
                        <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                        <p>Cookies set by the website owner (in this case, AlgoGuardian) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.</p>

                        <h2>WHY DO WE USE COOKIES?</h2>
                        <p>We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.</p>

                        <h2>HOW CAN I CONTROL COOKIES?</h2>
                        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.</p>
                        <p>The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.</p>

                        <h3>Essential website cookies:</h3>
                        <p>These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</p>

                        <h3>Analytics and customization cookies:</h3>
                        <p>These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</p>

                        <h2>HOW CAN I CONTROL COOKIES ON MY BROWSER?</h2>
                        <p>As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><a href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Chrome</a></li>
                            <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Internet Explorer</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Firefox</a></li>
                            <li><a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Edge</a></li>
                            <li><a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Opera</a></li>
                        </ul>

                        <h2>HOW OFTEN WILL YOU UPDATE THIS COOKIE POLICY?</h2>
                        <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
                        <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
                    </div>
                );
            case 'affiliate-program':
                return (
                    <div className="prose prose-invert max-w-none">
                        <h1>AFFILIATE PROGRAM TERMS AND CONDITIONS</h1>
                        <p className="text-sm text-gray-400 mb-8">Last updated November 24, 2025</p>

                        <p>These Affiliate Program Terms and Conditions ("Agreement") govern the relationship between AlgoGuardian ("Company," "we," "us," or "our") and you ("Affiliate," "you," or "your") regarding your participation in our affiliate program ("Affiliate Program").</p>

                        <h2>1. Enrollment in the Affiliate Program</h2>
                        <p>1.1 To become an Affiliate, you must complete the Affiliate Program application on our website and agree to these Terms and Conditions.</p>
                        <p>1.2 We offer two different affiliate campaigns: AlgoGuardian Basic Affiliate program and AlgoGuardian Pro Affiliate program.</p>
                        <p>1.3 AlgoGuardian Basic Affiliate program is open to the public, and anyone can sign up for it.</p>
                        <p>1.4 AlgoGuardian Pro Affiliate program is a private campaign, and we are the only ones who can create promoters for this campaign.</p>

                        <h2>2. Affiliate Responsibilities</h2>
                        <p>2.1 As an Affiliate, you agree to promote our products or services in compliance with all applicable laws and regulations and in a manner that reflects positively on our brand.</p>
                        <p>2.1.1 Paid Advertising Restrictions. Affiliate shall not, directly or indirectly: (a) purchase, bid on, or otherwise use any of the trademarks, brand names, logos, and other indicia of origin associated with AlgoGuardian, or any variations, misspellings, or confusingly similar terms, as keywords, search terms, or identifiers in connection with any paid search engine marketing, display advertising, or other paid promotional activity; (b) place or otherwise include Affiliate Links in connection with any paid advertisement, including but not limited to search engine ads, social media ads, or display ads.</p>
                        <p>2.2 You will be solely responsible for the development, operation, and maintenance of your website and any other materials used to promote our products or services.</p>
                        <p>2.3 You agree not to engage in any deceptive, misleading, or unethical marketing practices.</p>

                        <h2>3. Commission Structure</h2>
                        <p>3.1 AlgoGuardian Basic Affiliate program: Affiliates will earn a 20% recurring commission on qualifying sales until the customer cancels the subscription. Referrals will also receive a 10% discount.</p>

                        <h2>4. Payment</h2>
                        <p>4.1 We will pay you commissions in accordance with our payment schedule, which may be subject to change at our discretion.</p>
                        <p>4.2 Payments will be made via Bank, subject to meeting any minimum payout thresholds and compliance with these Terms and Conditions. The minimum payout amount is $50.</p>

                        <h2>5. Cookie Lifetime</h2>
                        <p>5.1 The cookie lifetime is 30 days. Affiliates will receive credit for qualifying sales made within 30 days of a customer clicking their affiliate link.</p>

                        <h2>6. Intellectual Property</h2>
                        <p>6.1 You acknowledge that all intellectual property rights in our products or services, including but not limited to trademarks, copyrights, and trade secrets, belong exclusively to us.</p>
                        <p>6.2 You are granted a limited, non-exclusive, revocable license to use our trademarks and promotional materials solely for the purpose of promoting our products or services as part of the Affiliate Program.</p>

                        <h2>7. Termination</h2>
                        <p>7.1 Either party may terminate this Agreement at any time for any reason upon written notice to the other party.</p>
                        <p>7.2 Upon termination, you will no longer be entitled to earn commissions for sales made after the termination date.</p>

                        <h2>8. Limitation of Liability</h2>
                        <p>8.1 We will not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your participation in the Affiliate Program.</p>

                        <h2>9. Modification</h2>
                        <p>9.1 We reserve the right to modify these Terms and Conditions at any time, effective upon posting the modified terms on our website.</p>

                        <h2>10. Entire Agreement</h2>
                        <p>10.1 This Agreement constitutes the entire agreement between the parties regarding the subject matter herein and supersedes all prior or contemporaneous agreements, understandings, and communications, whether written or oral.</p>
                        <p>By enrolling in our Affiliate Program, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
                    </div>
                );
            default:
                return <div>Page not found</div>;
        }
    };

    return renderContent();
};
