"""
@File   :   marking_handling.py    
@Author :   sli
@Date   :   4/10/22
"""
import os
import pandas as pd
from utils.db_handling import query_db


def file_processing(filepath):
    """
    convert xlsx file to csv file
    @param filepath:
    @return:
    """
    read_file = pd.read_excel(filepath, engine='openpyxl')
    read_file.to_csv(filepath.replace(".xlsx", ".csv"),
                     index=None,
                     header=True)
    os.remove(filepath)
    return filepath.replace(".xlsx", ".csv")


def cal_all_average(filepath):
    """
    compute the average marking
    @param filepath:
    @return:
    """
    dic = {'A': 4, 'B': 3, 'C': 2, 'D': 1}
    df = pd.read_csv(filepath)
    df = df.iloc[:, [2, 3, 4, 5, 6]]
    for critiria in df:
        df = df.replace({critiria: dic})
    df = df.assign(mean=df.mean(axis=1))
    res = df['mean'].sum() / df['mean'].size
    return res


def marking_handling(filepath, student):
    """
    handle the marking files
    @param filepath: the marking file path
    @param student: student name
    @return:
    """
    if "xlsx" in filepath:
        # print(filepath)
        filepath = file_processing(filepath)
    marking = cal_all_average(filepath)
    query_db("insert into marking values(?, ?)", (student, float(marking), ))
    os.remove(filepath)
