import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FileList({ loggedInUser }) {
  const [files, setFiles] = useState([]);
  const [visible, setVisible] = useState(false);

  const fetchFiles = async () => {
    if (!loggedInUser) {
      console.error("Nincs bejelentkezett felhasználó!");
      return;
    }

    try {
      // Küldjük el a username-et GET paraméterként
      const response = await axios.get(`https://www.kacifant.hu/andris/list_files.php?username=${encodeURIComponent(loggedInUser)}`, {
        responseType: 'text'
      });

      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));

      const fileData = links.map(link => {
        let name = link.textContent || '';
        if (name.endsWith('.txt')) {
          name = name.slice(0, -4);
        }
        const text = link.getAttribute('data-szoveg') || "";
        return { name, text };
      });

      setFiles(fileData);
    } catch (error) {
      console.error('Hiba a fájlok lekérése során:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchFiles();
    }
  }, [visible, loggedInUser]);

  const downloadFile = (fileName, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center'
    }}>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'Bezár' : 'Fájlok listázása'}
      </button>
      {visible && (
        <div style={{ marginLeft: '10px' }}>
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadFile(file.name, file.text);
                  }}
                >
                  {file.name}.txt
                </a>
              </div>
            ))
          ) : (
            <p>Nincsenek fájlok.</p>
          )}
        </div>
      )}
    </div>
  );
}
