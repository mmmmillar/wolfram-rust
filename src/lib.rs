mod utils;

use wasm_bindgen::prelude::*;

extern crate js_sys;
extern crate web_sys;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub struct Universe {
    width: usize,
    depth: usize,
    last_row: Vec<bool>,
    rule: Vec<u32>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: usize, depth: usize, rule_number: usize) -> Universe {
        utils::set_panic_hook();

        let mut last_row = vec![false; width];
        last_row[(width / 2) as usize] = true;

        Universe {
            width,
            depth,
            last_row,
            rule: Self::set_rule(rule_number),
        }
    }

    fn set_rule(rule_num: usize) -> Vec<u32> {
        let mut rule_num_base_2 = format!("{:b}", rule_num);
        let num_zeros = 8 - rule_num_base_2.len();

        if num_zeros > 0 {
            rule_num_base_2 = "0".repeat(num_zeros) + &rule_num_base_2;
        }

        rule_num_base_2
            .chars()
            .filter_map(|c| c.to_digit(10))
            .collect()
    }

    pub fn tick(&mut self) {
        let mut row = vec![false; self.width];

        for i in 0..self.width {
            let mut neigbourhood = String::with_capacity(3);

            let left_index = if i as i32 - 1 < 0 { i } else { i - 1 };
            eprintln!("left_index: {:?}", left_index);
            match self.last_row[left_index] {
                true => neigbourhood.push('1'),
                false => neigbourhood.push('0'),
            };

            eprintln!("i: {:?}", i);
            match self.last_row[i] {
                true => neigbourhood.push('1'),
                false => neigbourhood.push('0'),
            };

            let right_index = if i + 1 >= self.width { i } else { i + 1 };
            eprintln!("right_index: {:?}", right_index);
            match self.last_row[right_index] {
                true => neigbourhood.push('1'),
                false => neigbourhood.push('0'),
            };

            let rule_index = 7 - usize::from_str_radix(&neigbourhood, 2).unwrap();
            eprintln!(
                "neighbourhood: {:?}, rule_index: {:?}, result: {:?}",
                neigbourhood,
                rule_index,
                self.rule[rule_index] != 0
            );

            row[i] = self.rule[rule_index] != 0;
        }

        self.last_row = row
    }

    pub fn last_row_ptr(&self) -> *const bool {
        self.last_row.as_slice().as_ptr()
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.depth
    }

    pub fn rule_str(&self) -> String {
        self.rule.iter().map(|c| c.to_string()).collect()
    }
}
