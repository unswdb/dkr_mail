from db_handling import query_db


data = query_db("select * from contact where name = ?", ("Shunyang", ))
print(data)