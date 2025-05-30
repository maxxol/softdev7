import json

import jsonschema
from jsonschema import validate



def validate_topic(schema_topic_file_path, incoming_topic_data, error_handler, topic_name=None):
    with open(schema_topic_file_path) as schema_topic_file:
        schema_topic = json.load(schema_topic_file)
        try:
            validate(
                instance=incoming_topic_data, schema=schema_topic,
            )
        except jsonschema.exceptions.ValidationError as e:
            if topic_name:
                error_handler(schema_topic, e, topic_name)
            else:
                error_handler(schema_topic, e)
