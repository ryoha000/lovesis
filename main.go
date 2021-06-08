package main

import (
	"archive/tar"
	"bytes"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/klauspost/compress/zstd"
)

func main() {
	// file, err := os.Open("vndb-db-2021-06-04.tar.zst")
	// if err != nil {
	// 	fmt.Errorf("%v", err)
	// 	os.Exit(1)
	// }
	// defer file.Close()

	// newFile, err := os.Create("decompress.tar")
	// if err != nil {
	// 	fmt.Errorf("%v", err)
	// 	os.Exit(1)
	// }


	newFile, err := os.Open("decompress.tar")
	if err != nil {
		log.Fatal(err)
	}

	
	_ = os.Mkdir("decompress", 0755)

	// err = Decompress(file, newFile)
	// if err != nil {
	// 	fmt.Errorf("%v", err)
	// 	os.Exit(1)
	// }

	err = OpenTAR(newFile)
	if err != nil {
		log.Fatal(err)
	}
}

func Decompress(in io.Reader, out io.Writer) error {
    d, err := zstd.NewReader(in)
    if err != nil {
        return err
    }
    defer d.Close()
    
    // Copy content...
    _, err = io.Copy(out, d)
    return err
}

func OpenTAR(in io.Reader) error {
	tarReader := tar.NewReader(in)
	
	for {
        header, err := tarReader.Next()
        if err == io.EOF {
            // ファイルの最後
            break
        }
        if err != nil {
            return err
        }
		if (strings.HasSuffix(header.Name, "/")) {
			continue
		}

        buf := new(bytes.Buffer)
        if _, err = io.Copy(buf, tarReader); err != nil {
            return err
        }

		s := filepath.Join("decompress", header.Name)
		d, _ := filepath.Split(s)

		if _, err = os.Stat(d); err != nil {
			err = os.MkdirAll(d, 0755)
			if err != nil {
				return err
			}
		}

		if err = ioutil.WriteFile(s, buf.Bytes(), 0755); err != nil {
			return err
		}
    }
	return nil
}
