def seconds_to_timestamp(seconds):

    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)

    if hours > 0:
        return f"{hours:02}:{minutes:02}:{seconds:02}"

    return f"{minutes:02}:{seconds:02}"


def format_docs(docs):

    formatted = []

    for doc in docs:

        start_val = doc.metadata.get("start")
        start = seconds_to_timestamp(start_val) if start_val is not None else "00:00"

        end_val = doc.metadata.get("end")
        end = seconds_to_timestamp(end_val) if end_val is not None else "00:00"

        formatted.append(
            f"""
Timestamp: {start} - {end}

Content:
{doc.page_content}
"""
        )

    return "\n\n".join(formatted)