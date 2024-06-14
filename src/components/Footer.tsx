function Footer() {
  return (
    <footer className="pt-3 mt-4 text-xs fixed bottom-8 w-full">
      <ul className="nav justify-content-center border-bottom mb-3">
        <li className="nav-item">
          <a className="nav-link px-2 text-body-secondary">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link px-2 text-body-secondary">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link px-2 text-body-secondary">Pricing</a>
        </li>
        <li className="nav-item">
          <a className="nav-link px-2 text-body-secondary">FAQs</a>
        </li>
        <li className="nav-item">
          <a className="nav-link px-2 text-body-secondary">About</a>
        </li>
      </ul>
      <div className="flex flex-col gap-2">
        <p className="text-center text-body-secondary">
          © 2024 Created by Ope Omiwade
        </p>
        <p className="text-center text-body-secondary font-bold">
          THIS IS NOT INSTAGRAM.THIS IS A CLONE CREATED FOR PRACTICE PURPOSES.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
