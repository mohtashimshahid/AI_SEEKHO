import pandas as pd
import openpyxl

def generate_sample_file(output_filename="sample_master_timetable.xlsx"):
    writer = pd.ExcelWriter(output_filename, engine="openpyxl")

    monday_data = [
        {"Course Code": "CS101", "Course Title": "Intro to Computer Science", "Section": "SEC-01", "Instructor": "Dr. Alan Turing", "Department": "Computer Science", "Time Slot": "08:30 - 09:45", "Room": "Hall A-101"},
        {"Course Code": "CS101", "Course Title": "Intro to Computer Science", "Section": "SEC-02", "Instructor": "Dr. Ada Lovelace", "Department": "Computer Science", "Time Slot": "10:00 - 11:15", "Room": "Hall B-202"},
        {"Course Code": "MATH201", "Course Title": "Calculus II", "Section": "SEC-01", "Instructor": "Prof. Isaac Newton", "Department": "Mathematics", "Time Slot": "08:30 - 09:45", "Room": "Math Lab 1"},
        {"Course Code": "MATH201", "Course Title": "Calculus II", "Section": "SEC-02", "Instructor": "Prof. Gottfried Leibniz", "Department": "Mathematics", "Time Slot": "11:30 - 12:45", "Room": "Math Lab 2"},
        {"Course Code": "PHYS102", "Course Title": "General Physics I", "Section": "SEC-01", "Instructor": "Dr. Marie Curie", "Department": "Physics", "Time Slot": "13:00 - 14:15", "Room": "Science Bldg 10"},
        {"Course Code": "PHYS102", "Course Title": "General Physics I", "Section": "SEC-02", "Instructor": "Dr. Richard Feynman", "Department": "Physics", "Time Slot": "14:30 - 15:45", "Room": "Science Bldg 12"},
        {"Course Code": "ENG105", "Course Title": "Academic Writing", "Section": "SEC-01", "Instructor": "Dr. Virginia Woolf", "Department": "English", "Time Slot": "10:00 - 11:15", "Room": "Humanities 3"},
        # Intentionally unparseable row to test parser error detection (§6.1)
        {"Course Code": "BAD_ROW", "Course Title": "Broken Row Test", "Section": "SEC-99", "Instructor": "Nobody", "Department": "Testing", "Time Slot": "INVALID_TIME_STRING", "Room": "Void"},
    ]

    tuesday_data = [
        {"Course Code": "CS202", "Course Title": "Data Structures & Algorithms", "Section": "SEC-01", "Instructor": "Dr. Donald Knuth", "Department": "Computer Science", "Time Slot": "09:00 - 10:15", "Room": "CS Lab 3"},
        {"Course Code": "CS202", "Course Title": "Data Structures & Algorithms", "Section": "SEC-02", "Instructor": "Dr. Edsger Dijkstra", "Department": "Computer Science", "Time Slot": "11:00 - 12:15", "Room": "CS Lab 4"},
        {"Course Code": "EE110", "Course Title": "Circuit Analysis", "Section": "SEC-01", "Instructor": "Dr. Nikola Tesla", "Department": "Electrical Eng", "Time Slot": "08:30 - 09:45", "Room": "EE Hall 1"},
        {"Course Code": "EE110", "Course Title": "Circuit Analysis", "Section": "SEC-02", "Instructor": "Dr. Thomas Edison", "Department": "Electrical Eng", "Time Slot": "13:00 - 14:15", "Room": "EE Hall 2"},
        {"Course Code": "MATH201", "Course Title": "Calculus II", "Section": "SEC-01", "Instructor": "Prof. Isaac Newton", "Department": "Mathematics", "Time Slot": "10:00 - 11:15", "Room": "Math Lab 1"},
        {"Course Code": "PHYS102", "Course Title": "General Physics I", "Section": "SEC-01", "Instructor": "Dr. Marie Curie", "Department": "Physics", "Time Slot": "14:30 - 15:45", "Room": "Science Bldg 10"},
    ]

    wednesday_data = [
        {"Course Code": "CS101", "Course Title": "Intro to Computer Science", "Section": "SEC-01", "Instructor": "Dr. Alan Turing", "Department": "Computer Science", "Time Slot": "08:30 - 09:45", "Room": "Hall A-101"},
        {"Course Code": "CS101", "Course Title": "Intro to Computer Science", "Section": "SEC-02", "Instructor": "Dr. Ada Lovelace", "Department": "Computer Science", "Time Slot": "10:00 - 11:15", "Room": "Hall B-202"},
        {"Course Code": "CS305", "Course Title": "Database Systems", "Section": "SEC-01", "Instructor": "Dr. Edgar Codd", "Department": "Computer Science", "Time Slot": "13:00 - 14:15", "Room": "CS Lab 1"},
        {"Course Code": "ENG105", "Course Title": "Academic Writing", "Section": "SEC-01", "Instructor": "Dr. Virginia Woolf", "Department": "English", "Time Slot": "10:00 - 11:15", "Room": "Humanities 3"},
    ]

    thursday_data = [
        {"Course Code": "CS202", "Course Title": "Data Structures & Algorithms", "Section": "SEC-01", "Instructor": "Dr. Donald Knuth", "Department": "Computer Science", "Time Slot": "09:00 - 10:15", "Room": "CS Lab 3"},
        {"Course Code": "CS305", "Course Title": "Database Systems", "Section": "SEC-01", "Instructor": "Dr. Edgar Codd", "Department": "Computer Science", "Time Slot": "13:00 - 14:15", "Room": "CS Lab 1"},
        {"Course Code": "EE110", "Course Title": "Circuit Analysis", "Section": "SEC-01", "Instructor": "Dr. Nikola Tesla", "Department": "Electrical Eng", "Time Slot": "08:30 - 09:45", "Room": "EE Hall 1"},
    ]

    friday_data = [
        {"Course Code": "MATH201", "Course Title": "Calculus II", "Section": "SEC-02", "Instructor": "Prof. Gottfried Leibniz", "Department": "Mathematics", "Time Slot": "11:30 - 12:45", "Room": "Math Lab 2"},
        {"Course Code": "PHYS102", "Course Title": "General Physics I", "Section": "SEC-02", "Instructor": "Dr. Richard Feynman", "Department": "Physics", "Time Slot": "14:30 - 15:45", "Room": "Science Bldg 12"},
    ]

    pd.DataFrame(monday_data).to_excel(writer, sheet_name="Monday", index=False)
    pd.DataFrame(tuesday_data).to_excel(writer, sheet_name="Tuesday", index=False)
    pd.DataFrame(wednesday_data).to_excel(writer, sheet_name="Wednesday", index=False)
    pd.DataFrame(thursday_data).to_excel(writer, sheet_name="Thursday", index=False)
    pd.DataFrame(friday_data).to_excel(writer, sheet_name="Friday", index=False)

    writer.close()
    print(f"Sample Excel timetable file written to {output_filename}")

if __name__ == "__main__":
    generate_sample_file()
