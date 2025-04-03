package com.openclassrooms.mddapi;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class MddApiApplicationTests {

    @Autowired
    private MddApiApplication mddApiApplication;

	@Test
	void contextLoads() {
		assertEquals(1, 1);
	}

	@Test
	void mainMethodShouldRunWithoutExceptions() {mddApiApplication.main(new String[]{});
	}
}
