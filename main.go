package main

import (
    "database/sql"
    "fmt"
    "os"
    _ "github.com/mattn/go-oci8"
)

func execSQL(db *sql.DB, sql string) bool{
    _,err := db.Exec(sql)
    if err != nil {
        fmt.Println(err)
        return false
    } else {
        return true
    }
}

func main() {
    db, err := sql.Open("oci8", os.Args[1])
    if err != nil {
        fmt.Println(err)
        return
    }
    defer db.Close()
    if !execSQL(db,"create table HOGE (NUM number(2),WORD varchar2(10))"){
        return
    }
    if !execSQL(db,"insert into HOGE values (1,'One')"){
        return
    }
    if !execSQL(db,"insert into HOGE values (2,'Two')"){
        return
    }
    if !execSQL(db,"insert into HOGE values (3,'Three')"){
        return
    }

    rows ,err := db.Query("select NUM,WORD  from HOGE order by NUM")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer rows.Close()
    for rows.Next(){
        var num int 
        var word string

        rows.Scan(&num, &word)
        fmt.Println(num, word)
    }
    _,err = db.Exec("drop table HOGE")
}
