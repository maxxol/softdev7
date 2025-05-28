import unittest
import io
import copy
from contextlib import redirect_stdout

from handle_validation import validate_topic
from handle_validation_errors import print_topic_errors, print_topic_sensoren_id_errors, \
    print_topic_sensoren_bruggen_errors, print_topic_voorrangsvoertuig_errors
from main import SCHEMA_FILE_PATHS


class HandleValidationErrorsTestShowCase(unittest.TestCase):
    def run_topic_validation_tests(self, topic, test_cases, print_func):
        for input_data, expected_output_start in test_cases:
            with self.subTest(topic=topic, input=input_data):
                f = io.StringIO()
                with redirect_stdout(f):
                    validate_topic(SCHEMA_FILE_PATHS[topic], input_data, print_func, topic)
                out = f.getvalue()

                if expected_output_start:
                    self.assertTrue(out.startswith(expected_output_start), f"Unexpected output: {out}")
                else:
                    self.assertEqual(out, "")


    def test_tijd_topic_validation(self):
        test_cases = [
            ({"simulatie_tijd_ms": 100}, ""),  # valid
            ({"simulatie_tijd_ms": -100}, "Topic 'tijd' | the value of 'simulatie_tijd_ms' must be higher than 0"),  # invalid
            ({}, "Topic 'tijd' | all these properties are missing: '['simulatie_tijd_ms']', in the json"),
        ]
        self.run_topic_validation_tests("tijd", test_cases, print_topic_errors)


    def test_sensoren_speciaal_topic_validation(self):
        test_cases = [
            ({"brug_wegdek": True,"brug_file": True,"brug_water": True}, ""),  # valid
            ({"brug_wegdek": 4,"brug_file": True,"brug_water": True}, "Topic 'sensoren_speciaal' | the value of 'brug_wegdek' must be of type 'boolean'"),
            ({}, "Topic 'sensoren_speciaal' | all these properties are missing:"),
        ]
        self.run_topic_validation_tests("sensoren_speciaal", test_cases, print_topic_errors)


    def test_sensoren_rijbaan_topic_validation(self):
        mock_data = {}
        for ID in ["1.1", "2.1", "2.2", "3.1", "4.1", "5.1", "6.1", "7.1", "8.1", "8.2", "9.1", "10.1", "11.1", "12.1", "21.1", "22.1", "23.1", "24.1", "25.1", "26.1", "27.1", "28.1", "31.1", "31.2", "32.1", "32.2", "33.1", "33.2", "34.1", "34.2", "35.1", "35.2", "36.1", "36.2", "37.1", "37.2", "38.1", "38.2", "41.1", "42.1", "51.1", "52.1", "53.1", "54.1", "71.1", "72.1"]:
            mock_data[ID] = {"voor": False, "achter": False}
        test_cases = [
            (mock_data, ""),  # valid
            # (mock_data["2.1"], "Topic 'sensoren_rijbaan' | the value of 'brug_wegdek' must be of type 'boolean'"),
            # ({}, "Topic 'sensoren_rijbaan' | all these properties are missing:"),
        ]
        copy_data = copy.deepcopy(mock_data)
        copy_data["2.1"]["voor"] = 1
        test_cases.append((copy_data, "Topic 'sensoren_rijbaan' | the value of '2.1->voor' must be of type "))
        self.run_topic_validation_tests("sensoren_rijbaan", test_cases, print_topic_sensoren_id_errors)


    def test_sensoren_bruggen_topic_validation(self):
        test_cases = [
            ({"81.1": {"state": "open"}}, ""),  # valid
            ({"81.1": {"state": "groen"}}, "Topic 'sensoren_bruggen' | '81.1->state' must be one of the following: ['dicht', 'open']"),
            ({}, "Topic 'sensoren_bruggen' | all these properties are missing:"),
        ]
        self.run_topic_validation_tests("sensoren_bruggen", test_cases, print_topic_sensoren_bruggen_errors)


    def test_voorrangsvoertuig_topic_validation(self):
        test_cases = [
            ({"queue": [{
                         "baan": "3.1",
                         "simulatie_tijd_ms": 1231456650000,
                         "prioriteit": 2
                     }]}, ""),  # valid
            ({"queue": [{
                "baan": "3.1",
                "simulatie_tijd_ms": "nee",
                "prioriteit": 2
            }]}, "Topic 'voorrangsvoertuig' | the value of 'queue[0]->simulatie_tijd_ms' must be of type"),
            ({}, "Topic 'voorrangsvoertuig' | all these properties are missing:"),
        ]
        self.run_topic_validation_tests("voorrangsvoertuig", test_cases, print_topic_voorrangsvoertuig_errors)


if __name__ == '__main__':
    unittest.main()