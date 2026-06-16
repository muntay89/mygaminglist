export default function Footer() {

  return(
    <footer id="footer">
        <span id="copyright">© 2023</span>
        <span id="foottitle">MyVideoGameList</span>
        <span id="icons">
          {/* <i className="fa-brands fa-apple fa-lg" style="color: #ffffff"></i>
          <i className="fa-brands fa-google fa-lg" style="color: #000000"></i>
          <i className="fa-brands fa-facebook fa-lg" style="color: #1e3050"></i>
          <i className="fa-brands fa-twitter fa-lg" style="color: #ffffff"></i> */}
        </span>
        <nav id="footernav">
          <ul>
            <li><a href="">About</a></li>
            <li><a href="">Support</a></li>
            <li><a href="">Upgrade</a></li>
            <li><a href="">Terms of Service</a></li>
            <li><a href="">Privacy Policy</a></li>
          </ul>
        </nav>
      </footer>
  )
}