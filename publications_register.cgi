#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import os
import sys

def main():
    html = '''Content-Type: text/html; charset=utf-8\n\n

    <html>
    <head>
    </head>
    <body>
    <h2>登録確認ページ</h2>
    <p>以下の内容で登録します。\n
    登録内容の変更はシステム管理者しか行えません。\n
    間違いがないか十分に確認してください。\n
    </p>
    <form enctype="multipart/form-data" action="http://192.168.100.195/cgi-bin/publications_register-utf8.cgi" method="post">
    <table cellspacing="1" border="0">
    <tr><th>Format</th><td>%s</td></tr>
    <tr><th>Author</th><td>%s</td></tr>
    <tr><th>Title</th><td>%s</td></tr>
    <tr><th>Journal/Conference</th><td>%s</td></tr>
    <tr><th>Year</th><td>%s</td></tr>
    <tr><th>Month</th><td>%s</td></tr>
    <tr><th>Volume</th><td>%s</td></tr>
    <tr><th>Number</th><td>%s</td></tr>
    <tr><th>Pages</th><td>%s</td></tr>
    <tr><th>DOI</th><td>%s</td></tr>
    <tr><th>Abstract</th><td>%s</td></tr>
    </table>
    <input type="submit" name="submit" value="submit">
    </body>
    </html>
    '''

    if os.environ['REQUEST_METHOD'] != "POST":
        print 'illegal access.'
        sys.exit()

    form = cgi.FieldStorage()
    # txt = f.getfirst('address', '')
    # print html % cgi.escape(txt)

    f_form = form.getvalue('format', 'none')
    f_author = " and ".join(form.getlist('author'))
    f_title = form.getvalue('title', 'none')
    f_journal = form.getvalue('journal', 'none')
    f_year = form.getvalue('year', '2015')
    f_month = form.getvalue('month', '0')
    f_volume = form.getvalue('volume', '0')
    f_number = form.getvalue('number', '0')
    f_pages = form.getvalue('pages', '')
    f_doi = form.getvalue('doi', '')
    f_abstract = form.getvalue('abstract', '')


    print html % (f_form, f_author, f_title, f_journal, f_year, f_month, f_volume, f_number, f_pages, f_doi, f_abstract)

if __name__=='__main__':
    main()
