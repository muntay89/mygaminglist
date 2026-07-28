import { useState } from "react";
import { FaXbox, FaPlaystation, FaWindows, FaGamepad } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";

const platforms = [
  {
    name: "All",
    value: "",
    icon: <FaGamepad/>,
  },
  {
    name: "Xbox",
    value: "&platforms=14,1,186",
    icon: <FaXbox />,
  },
  {
    name: "PlayStation",
    value: "&platforms=18,16,19,187",
    icon: <FaPlaystation />,
  },
  {
    name: "Nintendo",
    value: "&platforms=7,8,9,10,11,83,43,105,24",
    icon: <SiNintendoswitch />,
  },
  {
    name: "PC",
    value: "&platforms=5,6,4",
    icon: <FaWindows />,
  },
]

function PlatformDropdown(props) {
  
  const [open, setOpen] = useState(false);
  const selected = platforms.find((platform) => platform.value === props.filter) 
  ?? platforms[0]
  function handleSelect(platform) {
    props.setFilter(platform.value);
    setOpen(false);
  }

  return (
    <div className="platform-dropdown">
      <button
      style = {{borderRadius: open ? '10px 0px 0px 0px' : '10px 0px 0px 10px',
      }}
        type="button"
        className="platform-dropdown-button"
        onClick={() => setOpen(!open)}
      >
        <span className="platform-icon">{selected.icon}</span>
        <span>{selected.name}</span>
        <span className="dropdown-arrow">▾</span>
      </button>

      {open && (
        <div className="platform-dropdown-menu">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              type="button"
              className="platform-dropdown-option"
              onClick={() => handleSelect(platform)}
            >
              <span className="platform-icon">{platform.icon}</span>
              <span>{platform.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlatformDropdown;