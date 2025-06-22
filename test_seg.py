"""
A test module
this is a module docstring
"""

from typing import Union, Tuple, List, Dict
import cv2, matplotlib, math
from __future__ import annotations


class A:
    "C A"


def m1():
    pass


async def m2():
    pass


class B(A):
    "C B"

    def __init__(self, *args, **kwgs):
        pass

    def example(self, val: str = "123123") -> A:
        """
        example method doc
        """
        pass

    def byte(self, b: bytes = b"112233") -> B:
        def nested_method(self) -> None:
            pass

    @staticmethod
    def sm():
        a = 1

    def line(
        self,
        aaaaaaaaaaa=1,
        bbbbbbbbbbb=2,
        ccccccccccc=3,
        ddddddddddd=4,
        eeeeeeeeeee=5,
        fffffffffff=6,
    ):
        pass
