import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  const contacts = [
    { id: "1", name: "Instagram", elemt: <FaInstagram /> },
    { id: "2", name: "Facebook", elemt: <FaFacebook /> },
    { id: "3", name: "Youtube", elemt: <FaYoutube /> },
    { id: "4", name: "Twitter", elemt: <FaXTwitter /> },
  ];

  return (
    <div className="flex justify-between bg-secondary-light p-4 border-y-[1px]">
      <div>©2025 AllTask, Inc.</div>
      <div className="">
        <ul className="flex gap-2 text-xl">
          {contacts.map((elem) => (
            <li
              key={elem.id}
              className="bg-primary-dark p-1 rounded-full text-neutral-light"
            >
              {elem.elemt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
