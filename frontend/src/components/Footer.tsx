const Footer = () => {
  return (
    <div className="bg-blue-500 py-6 md:py-10">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <span className="text-2xl text-white font-bold tracking-tight ">
          MaishaLondon
        </span>
        <span className="text-white font-bold tracking-tight flex gap-4">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
